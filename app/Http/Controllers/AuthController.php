<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Utils\LogHelper;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     *
     * @return JsonResponse
     */
    public function userLogin(): JsonResponse
    {
        $data = request()->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $user = User::where(['email' => $data['email']])->first();

        if (!$user) {
            throw new UnprocessableEntityHttpException('Sorry! Provided email is not registered.');
        }

        if (Hash::check($data['password'], $user->password)) {

            $msg = 'Login successful';

            // sanctum token creation data
            return $this->handleTokenCreation($user, $msg);
        }

        LogHelper::debug([
            'message' => 'Login attempt failed',
            'email' => $data['email'],
        ]);

        throw new UnprocessableEntityHttpException('Invalid credentials, please try again!');
    }

    /**
     * @param User $user
     * @param $msg
     * @return JsonResponse
     */
    private function handleTokenCreation(User $user, $msg): JsonResponse
    {
        $token = $user->createToken($user->email . '_spa_token')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::now()->addDays(7)->toDateTimeString(),
            'message' => $msg
        ]);
    }

    /**
     * Register user and create token
     *
     * @return JsonResponse
     */
    public function userRegister(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return $this->handleTokenCreation($user, 'Registration successful');
    }

    /**
     * Retrieve authenticated user details
     *
     * @return JsonResponse
     */
    public function getCurrentUser(): JsonResponse
    {
        $user = User::query()->find(request()->user()->id);

        return response()->json([
            'user' => new UserResource($user),
            'message' => 'Success!'
        ]);
    }

    /***
     * Logout authenticated user
     *
     * @return JsonResponse
     */
    public function userLogout(): JsonResponse
    {
        request()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}
