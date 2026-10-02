<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;

use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index()
    {
        $categories = Category::latest()->get();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'=> ['required', 'string', 'max:255'],
            'slug'=> ['required', 'string', 'max:255', 'unique:categories,slug'],
            'description'=> ['nullable', 'string'],
            'status'=> ['required', 'boolean'],
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message'=> 'Category created successfully.',
            'data' => $category,
        ], 201);
    }

    public function show(Category $category) 
    {
        return response()->json([
            'data' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'=> ['required', 'string', 'max:255'],
            'slug'=> ['required', 'string', 'max:255', 'unique:categories,slug,' . $category->id],
            'description'=> ['nullable', 'string'],
            'status'=> ['required', 'boolean'],
        ]);

        $category->update($validated);

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => $category
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    
    }
}
