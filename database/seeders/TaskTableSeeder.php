<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tasks')->truncate();

        Task::create([
            'title' => 'Task 1',
            'description' => 'Task 1 description',
            'user_id' => 1,
        ]);
        Task::create([
            'title' => 'Task 2',
            'description' => 'Task 2 description',
            'user_id' => 1,
        ]);
        Task::create([
            'title' => 'Task 3',
            'description' => 'Task 3 description',
            'user_id' => 1,
        ]);
        Task::create([
            'title' => 'Task 4',
            'description' => 'Task 4 description',
            'user_id' => 2,
        ]);
        Task::create([
            'title' => 'Task 5',
            'description' => 'Task 5 description',
            'user_id' => 2,
        ]);
    }
}
