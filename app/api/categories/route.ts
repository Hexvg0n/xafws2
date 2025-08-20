// app/api/categories/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CategoryModel from '@/models/Category';
import ProductModel from '@/models/Product';

// GET - Pobierz wszystkie kategorie wraz z liczbą produktów
export async function GET() {
    await dbConnect();
    try {
        const categories = await CategoryModel.find({}).sort({ name: 1 });
        
        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await ProductModel.countDocuments({ category: category._id });
                return {
                    ...category.toObject(),
                    productCount,
                };
            })
        );
        
        return NextResponse.json(categoriesWithCount);
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}

// POST - Stwórz nową kategorię
export async function POST(req: Request) {
    await dbConnect();
    try {
        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ error: 'Nazwa kategorii jest wymagana.' }, { status: 400 });
        }
        const newCategory = new CategoryModel({ name });
        await newCategory.save();
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        if (error instanceof Error && 'code' in error && (error as any).code === 11000) {
            return NextResponse.json({ error: 'Kategoria o tej nazwie już istnieje.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}

// DELETE - Usuń kategorię
export async function DELETE(req: Request) {
    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'ID kategorii jest wymagane.' }, { status: 400 });
        }

        // Krok 1: Zaktualizuj produkty, które miały tę kategorię
        await ProductModel.updateMany({ category: id }, { $unset: { category: 1 } });
        
        // Krok 2: Usuń kategorię
        await CategoryModel.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Kategoria została usunięta.' });
    } catch (error) {
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
    }
}