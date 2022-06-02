<?php

namespace Tests\Unit\Http;

use App\Models\User;

use Database\Seeders\TestDatabaseSeeder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class AbstractHttpTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Run a specific seeder before each test.
     *
     * @var string
     */
    protected $seeder = TestDatabaseSeeder::class;

    protected function dumpResponseAsVarExport($response)
    {
        var_export(json_decode($response->getContent(), true));
    }

    protected function getResponseData($response)
    {
        return json_decode($response->getContent(), true);
    }

    protected function assertDataLength($response, $length)
    {
        $data = $this->getResponseData($response)['data'];

        $this->assertTrue(count($data) === $length);
    }

    protected function actingAsAdminUser()
    {
        return $this->actingAs(User::whereHas('roles', function (Builder $q) {
            $q->where('name', 'admin');
        })->first(), 'api');
    }

    protected function actingAsEditorUser()
    {
        return $this->actingAs(User::whereHas('roles', function (Builder $q) {
            $q->where('name', 'editor');
        })->first(), 'api');
    }

    protected function actingAsNormalUser($userId)
    {
        return $this->actingAs(User::find($userId), 'api');
    }

    protected function getNormalUser($userId)
    {
        return User::query()->find($userId);
    }
}
