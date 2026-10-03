<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_regular_user_cannot_create_categories(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/categories', [
            'name' => 'Test Category',
            'slug' => 'test-category',
            'description' => 'Authorization test',
            'status' => true,
        ]);

        $response
            ->assertStatus(403)
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_admin_can_create_categories(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/categories', [
            'name' => 'Test Category',
            'slug' => 'test-category',
            'description' => 'Authorization test',
            'status' => true,
        ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'message' => 'Category created successfully.',
            ]);
    }
}