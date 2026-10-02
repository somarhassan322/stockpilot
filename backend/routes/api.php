<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\Api\ProductController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

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

    Route::apiResource('categories',CategoryController::class);
    Route::apiResource('products',ProductController::class);
});
