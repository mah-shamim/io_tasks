<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\TaskResource;
use App\Interfaces\TaskRepositoryInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class TaskController extends AbstractController
{
    private TaskRepositoryInterface $taskRepository;

    public function __construct(TaskRepositoryInterface $repositoryInterface)
    {
        $this->taskRepository = $repositoryInterface;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $searchData = request()->toArray();

        $searchData['perPage'] = $searchData['perPage']?? $this->perPage;
        $searchData['user_id'] = request()->user()->id;

        return TaskResource::collection($this->taskRepository->indexPaginatedTasksForUser($searchData));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return TaskResource
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        // add user id to data
        $data['user_id'] = request()->user()->id;

        // create task and return response
        $task = $this->taskRepository->createTask($data);

        return new TaskResource($task);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return TaskResource
     */
    public function show(int $id): TaskResource
    {
        $task = $this->taskRepository->getTaskByIdForUser($id, request()->user()->id);

        if (!$task) {
            throw new NotFoundHttpException('Task not found');
        }

        return new TaskResource($task);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return TaskResource
     */
    public function update(StoreTaskRequest $request, $id): TaskResource
    {
        $data = $request->validated();

        $task = $this->taskRepository->updateTask($id, request()->user()->id, $data);

        if (!$task) {
            throw new NotFoundHttpException('Task not found');
        }

        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        if (!$this->taskRepository->deleteTask($id, request()->user()->id)) {
            throw new UnprocessableEntityHttpException('Task cannot be deleted!');
        }

        return $this->transformResponse([], 'Task deleted successfully');
    }
}
