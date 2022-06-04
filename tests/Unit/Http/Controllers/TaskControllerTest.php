<?php

namespace Tests\Unit\Http\Controllers;

use Tests\Unit\Http\AbstractHttpTest;

class TaskControllerTest extends AbstractHttpTest
{
    /**
     * test user store task successful
     */
    public function testTaskStoreSuccess()
    {
        $title = 'Kubernetes.';
        $userId = 1; // must already exist from running the seeders

        $requestBody = [
            'title' => $title,
            'description' => 'Kubernetes is cool but tough to learn.',
        ];

        // this end point stores and returns the saved model as json
        $route = route('tasks.store');

        $response = $this->actingAsUser($userId)
            ->json('POST', $route, $requestBody);

        $this->dumpResponseAsVarExport($response);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', $title)
            ->assertJsonPath('data.user_id', $userId);
    }
}
