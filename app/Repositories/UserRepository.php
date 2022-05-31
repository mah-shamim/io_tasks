<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository implements UserRepositoryInterface
{

    public function getAllUsers(): Collection
    {
        return User::all();
    }

    public function indexPaginatedUsers($search)
    {
        // TODO: Implement indexPaginatedUsers() method.
    }

    public function getUserById($id)
    {
        return User::find($id);
    }

    public function createUser(array $data): User
    {
        return User::create($data);
    }

    public function updateUser($id, array $data): ?User
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        $user->update($data);

        return $user;
    }

    public function deleteUser($id): ?bool
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        $user->delete();

        return true;
    }
}
