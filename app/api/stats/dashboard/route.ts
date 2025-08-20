// app/api/stats/dashboard/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import BatchModel from '@/models/Batch';
import SellerModel from '@/models/Seller';
import UserModel from '@/models/User';
import HistoryModel from '@/models/History'; // <<< Nowy import
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    await dbConnect();

    try {
        // 1. Kluczowe wskaźniki ogólne (bez zmian)
        const totalProducts = await ProductModel.countDocuments();
        const totalBatches = await BatchModel.countDocuments();
        const totalSellers = await SellerModel.countDocuments();
        const totalUsers = await UserModel.countDocuments();
        
        const productStats = await ProductModel.aggregate([
            { $group: { _id: null, totalFavorites: { $sum: '$favorites' }, totalViews: { $sum: '$views' } } }
        ]);
        const batchStats = await BatchModel.aggregate([
            { $group: { _id: null, totalFavorites: { $sum: '$favorites' }, totalViews: { $sum: '$views' } } }
        ]);

        const totalFavorites = (productStats[0]?.totalFavorites || 0) + (batchStats[0]?.totalFavorites || 0);
        const totalViews = (productStats[0]?.totalViews || 0) + (batchStats[0]?.totalViews || 0);

        // 2. Analiza aktywności użytkowników (NOWA LOGIKA)
        const userActivity = await HistoryModel.aggregate([
            { $group: { _id: '$user.name', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $project: { _id: 0, name: '$_id', count: 1 } }
        ]);


        const stats = {
            keyIndicators: {
                totalProducts,
                totalBatches,
                totalSellers,
                totalFavorites,
                totalViews,
                totalUsers,
            },
            userActivity, // <<< Zastąpiono `userAnalysis`
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error("Błąd podczas pobierania statystyk:", error);
        return NextResponse.json({ error: 'Błąd serwera podczas pobierania statystyk.' }, { status: 500 });
    }
}