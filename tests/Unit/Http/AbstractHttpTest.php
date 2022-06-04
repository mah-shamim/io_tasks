<?php

namespace Tests\Unit\Http;

use App\Models\User;

use Database\Seeders\TestDatabaseSeeder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class AbstractHttpTest extends TestCase
{

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

    protected function actingAsUser($userId)
    {
        return $this->actingAs(User::find($userId), 'web');
    }

    protected function getNormalUser($userId)
    {
        return User::query()->find($userId);
    }
}
