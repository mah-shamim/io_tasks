<?php

namespace App\Repositories;

use App\Interfaces\TaskRepositoryInterface;
use App\Models\Task;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class TaskRepository implements TaskRepositoryInterface
{

    public function getAllTasks(): Collection
    {
        return Task::all();
    }

    public function indexPaginatedTasksForUser(array $search): LengthAwarePaginator
    {
        if ($search['user_id'] ?? false) {
            $query = Task::query()->where('user_id', $search['user_id']);
        } else {
            $query = Task::query();
        }

        // search query filters
        $filters = preg_split('/\s+/', $search['searchQuery'] ?? '', -1, PREG_SPLIT_NO_EMPTY);

        if (count($filters) > 0) {
            $query->where(function (Builder $q) use ($filters) {
                foreach ($filters as $filter) {
                    $q->where(function (Builder $qq) use ($filter) {
                        $qq->where('title', 'LIKE', "%{$filter}%")
                            ->orWhere('description', 'LIKE', "%{$filter}%");
                    });
                }
            });
        }

        // add relationships to be included if it exists
        if ($search['includeRelations'] ?? false) {
            $includes = $search['includeRelations'];
            $addInclude = [];
            foreach ($includes as $include) {
                if (in_array($include, Task::availableRelationships)) {
                    $addInclude[] = $include;
                }
            }
            $query->with($addInclude);
        }

        return $query->paginate($search['perPage'] ?? 10);
    }

    public function getTaskById($id): ?Task
    {
        return Task::find($id);
    }

    public function createTask(array $data)
    {
        return Task::create($data);
    }

    public function updateTask($id, $ownerId, array $data): ?Task
    {
        $task = Task::where([
            'id' => $id,
            'user_id' => $ownerId
        ])
            ->first();

        if (!$task) {
            return null;
        }

        $task->update($data);

        return $task;
    }

    public function deleteTask($id, $ownerId): ?bool
    {
        $task = Task::where([
            'id' => $id,
            'user_id' => $ownerId
        ])
            ->first();

        if (!$task) {
            return null;
        }

        $task->delete();

        return true;
    }

    public function getTaskByIdForUser($id, $ownerId)
    {
        return Task::where([
            'id' => $id,
            'user_id' => $ownerId
        ])
            ->first();
    }
}
