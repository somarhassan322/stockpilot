<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\Api\ProductController;

Route::get('/health', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel API is working',
        'app' => config('app.name'),
        'timestamp' => now()->toISOString(),
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me',[AuthController::class, 'me']);
    Route::post('/logout',[AuthController::class, 'logout']);

    // Authenticated users can view inventory.
    Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);

    Route::apiResource('products', ProductController::class)->only(['index', 'show']);

    Route::middleware('admin')->group(function () {
        Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);

        Route::apiResource('products', ProductController::class)->only(['store', 'update', 'destroy']);
    });
});
