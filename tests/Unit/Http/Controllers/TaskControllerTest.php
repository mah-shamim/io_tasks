<?php

namespace Tests\Unit\Http\Controllers;

use App\Models\Task;
use Tests\Unit\Http\AbstractHttpTest;

class TaskControllerTest extends AbstractHttpTest
{
    /**
     * test user store task successful
     */
    public function testTaskStoreSuccess(): void
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

        $response->assertStatus(201)
            ->assertJsonPath('data.title', $title)
            ->assertJsonPath('data.user_id', $userId);
    }

    /**
     * test task store with invalid data should fail
     */
    public function testTaskStoreInvalid(): void
    {
        $userId = 1; // user must already exist from running the seeders

        $requestBody = [];

        // this end point stores and returns the saved model as json
        $route = route('tasks.store');

        $response = $this->actingAsUser($userId)
            ->json('POST', $route, $requestBody);

        $response
            ->assertStatus(422)
            ->assertJson(require __DIR__ . '/responses/tasks/tasks-store-invalid-response.php');
    }

    /**
     * test tasks index returns unauthenticated for non-logged in user
     */
    public function testTasksIndexUnAuthenticated(): void
    {
        $route = route('tasks.index');

        $response = $this
            ->json('GET', $route);

        $response->assertStatus(401)
            ->assertJsonFragment([
                'message' => 'Authentication error! Please login to use this service',
            ]);
    }

    /**
     * test tasks index returns array of tasks for a specific user
     * with the user's id in the response
     * with array of tasks in the data key matching a certain structure
     */
    public function testTasksIndexForUser()
    {
        // tasks for user id 1
        $userId = 1; // user must already exist from running the seeders
        $perPage = 10;

        $requestBody = [
            'user' => $userId,
            'perPage' => $perPage
        ];

        $userTasks = Task::query()->where(['user_id' => $userId])->limit($perPage)->get()->toArray();

        $route = route('tasks.index');

        $response = $this->actingAsUser($userId)
            ->json('GET', $route, $requestBody);

        $response->assertStatus(200)
            ->assertJsonPath('data.0.title', $userTasks[0]['title'])
            ->assertJsonPath('data.0.user_id', $userId)
            ->assertJsonStructure(require __DIR__ . '/responses/tasks/tasks-index-response.php');

        $this->assertDataLength($response, count($userTasks));
    }

    /**
     * test task update failure for user that does not own the task
     */
    public function testTaskUpdateFailure()
    {
        $title = 'This cool title has been updated.';
        $userId = 2; // must already exist from running the seeders
        $taskId = 1; // must already exist from running the seeders and be owned by another user

        $requestBody = [
            'title' => $title,
            'description' => 'While strolling along the river bed, they never met',
        ];

        // task update endpoint
        $route = route('tasks.update', ['task' => $taskId]);

        $response = $this->actingAsUser($userId)
            ->json('PUT', $route, $requestBody);

        $response->assertStatus(404)
            ->assertJsonFragment(["message" => "Task not found"]);
    }

    /**
     * test update task successful for a user that owns the task
     */
    public function testTaskUpdateSuccess()
    {
        $title = 'This cool title has been updated.';
        $taskId = 1; // must already exist from running the seeders
        $userId = 1; // must already exist from running the seeders and owns the task

        $requestBody = [
            'title' => $title,
            'description' => 'While strolling along the river bed, they never met',
        ];

        // this end point updates the resource and returns the saved model as json
        $route = route('tasks.update', ['task' => $taskId]);

        $response = $this->actingAsUser($userId)
            ->json('PUT', $route, $requestBody);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', $title);
    }

    /**
     * test task show not found
     */
    public function testTaskShowNotFound()
    {
        $taskId = 20; // this id does not exist as the test seeders only added 5 tasks
        $route = route('tasks.show', ['task' => $taskId]);
        $userId = 1; // must already exist from running the seeders

        $response = $this->actingAsUser($userId)
            ->json('GET', $route);

        $response->assertStatus(404)
            ->assertJsonFragment(["message" => "Task not found"]);
    }

    /**
     * test delete task failure for a user that does not own the task
     */
    public function testTaskDeleteFailure()
    {
        $userId = 2; // must already exist from running the seeders
        $taskId = 1; // must already exist from running the seeders and be owned by another user

        $route = route('tasks.destroy', ['task' => $taskId]);

        // delete post
        $response = $this->actingAsUser($userId)->json('DELETE', $route);

        $response->assertStatus(422)
            ->assertJsonFragment(["message" => "Task cannot be deleted!"]);
    }

    /**
     * test task delete success for a user that owns the task
     */
    public function testTaskDeleteSuccess()
    {
        $taskId = 2; // must already exist from running the seeders
        $userId = 1; // must already exist from running the seeders

        $route = route('tasks.destroy', ['task' => $taskId]);

        // delete post
        $response = $this->actingAsUser($userId)->json('DELETE', $route);

        $response->assertStatus(200)
            ->assertJsonFragment(["message" => "Task deleted successfully"]);

        // try to show the deleted task and assert it is not found
        $showRoute = route('tasks.show', ['task' => $taskId]);
        $response = $this->json('GET', $showRoute);

        $response->assertStatus(404)
            ->assertJsonFragment(["message" => "Task not found"]);
    }
}
