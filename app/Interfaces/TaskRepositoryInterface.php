<?php

namespace App\Interfaces;

interface TaskRepositoryInterface
{
    public function getAllTasks();
    public function indexPaginatedTasksForUser(array $search);
    public function getTaskById($id);
    public function getTaskByIdForUser($id, $ownerId);
    public function createTask(array $data);
    public function updateTask($id, $ownerId, array $data);
    public function deleteTask($id, $ownerId);
}
