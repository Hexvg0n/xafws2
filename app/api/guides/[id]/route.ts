// app/api/guides/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GuideModel from '@/models/Guide';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { logHistory } from '@/lib/historyLogger';

// PATCH - Aktualizuj poradnik
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const updatedGuide = await GuideModel.findByIdAndUpdate(params.id, body, { new: true });
        if (!updatedGuide) return NextResponse.json({ error: 'Nie znaleziono poradnika' }, { status: 404 });
        
        // <<< LOGOWANIE DO HISTORII >>>
        await logHistory(session, 'edit', 'guide', updatedGuide._id.toString(), `zedytował poradnik "${updatedGuide.title}"`);
        
        return NextResponse.json(updatedGuide);
    } catch (error) {
        return NextResponse.json({ error: 'Błąd podczas aktualizacji poradnika' }, { status: 400 });
    }
}

// DELETE - Usuń poradnik
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user || !['admin', 'root'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }
    
    await dbConnect();
    try {
        const deletedGuide = await GuideModel.findByIdAndDelete(params.id);
        if (!deletedGuide) return NextResponse.json({ error: 'Nie znaleziono poradnika' }, { status: 404 });
        
        // <<< LOGOWANIE DO HISTORII >>>
        await logHistory(session, 'delete', 'guide', deletedGuide._id.toString(), `usunął poradnik "${deletedGuide.title}"`);

        return NextResponse.json({ message: 'Poradnik usunięty pomyślnie' });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd podczas usuwania poradnika' }, { status: 500 });
    }
}