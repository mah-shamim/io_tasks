<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

abstract class AbstractController extends Controller
{
    public int $perPage = 10;

    /**
     * @param $dir
     * @return bool
     */
    public function allowedSortDir($dir): bool
    {
        $dir = Str::upper($dir);

        $sortDir = ['ASC', 'DESC'];

        return in_array($dir, $sortDir);
    }

    public function transformResponse($data,  $message = 'Success!'): JsonResponse
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
        ]);
    }
}
