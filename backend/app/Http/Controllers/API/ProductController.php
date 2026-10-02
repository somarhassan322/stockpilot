<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    //
    public function index() 
    {
        $products = Product::with('category')->latest()->get();

        return response()->json([
            'data' => $products,
        ]);
    }

    public function store(Request $request) 
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name'=> ['required', 'string', 'max:255'],
            'slug'=> ['required', 'string', 'max:255', 'unique:categories,slug'],
            'description'=> ['nullable', 'string'],
            'price'=> ['required', 'numeric', 'min:0'],
            'stock'=> ['required', 'integer', 'min:0'],
            'image'=> ['required', 'image', 'max:2048'],
            'status'=> ['required', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->storeAs(
                'products',
                $validated['slug'] . '.' . $request->file('image')->extension(),
                'public'
            );
        }

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => $product->load('category'),
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'data' => $product-> load('category'),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name'=> ['required', 'string', 'max:255'],
            'slug'=> ['required', 'string', 'max:255', 'unique:products,slug,' . $product->id],
            'description'=> ['nullable', 'string'],
            'price'=> ['required', 'numeric', 'min:0'],
            'stock'=> ['required', 'integer', 'min:0'],
            'image'=> ['nullable', 'image', 'max:2048'],
            'status'=> ['required', 'boolean'],
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->storeAs(
                'product',
                $validated['slug'] . '.' . $request->file('image')->extension(),
                'public'
            );
        }

        $product->update($validated);

        return response()->json([
            'message'=> 'Product updated successfully.',
            'data' => $product->load('category'),
        ]);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();
        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
