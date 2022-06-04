<?php

namespace Tests\Unit\Http\Controllers;

use Tests\Unit\Http\AbstractHttpTest;

class AuthControllerTest extends AbstractHttpTest
{
    /**
     * user login empty fields
     */
    public function testUserLoginEmptyFields()
    {
        $requestBody = [];

        $route = route('auth.login');

        $response = $this
            ->json('POST', $route, $requestBody);

        $response
            ->assertStatus(422)
            ->assertJson(require __DIR__ . '/responses/auth/auth-login-invalid-response.php');
    }

    /**
     * user login wrong password
     */
    public function testUserLoginWrongPassword()
    {
        $requestBody = [
            'email' => 'admin@tasks.test',
            'password' => 'wrong_pass'
        ];

        $route = route('auth.login');

        $response = $this
            ->json('POST', $route, $requestBody);

        $response
            ->assertStatus(422)
            ->assertJsonFragment(["message" => "Invalid credentials, please try again!"]);
    }

    /**
     * user login wrong email
     */
    public function testUserLoginWrongEmail()
    {
        $requestBody = [
            'email' => 'some_user@email.test',
            'password' => 'secret'
        ];

        $route = route('auth.login');

        $response = $this
            ->json('POST', $route, $requestBody);

        $response
            ->assertStatus(422)
            ->assertJsonFragment(["message" => "Sorry! Provided email is not registered."]);
    }

    /**
     * test user login success
     */
    public function testUserLoginSuccess()
    {
        $requestBody = [
            'email' => 'admin@tasks.test',
            'password' => '123secret'
        ];

        $route = route('auth.login');

        $response = $this
            ->json('POST', $route, $requestBody);

        $response->assertStatus(200)
            ->assertJsonStructure(require __DIR__ . '/responses/auth/auth-login-success-response.php');
    }

    /**
     * test user register Empty Fields
     */
    public function testUserRegisterEmptyFields()
    {
        $requestBody = [];

        $route = route('auth.register');

        $response = $this
            ->json('POST', $route, $requestBody);

        $response
            ->assertStatus(422)
            ->assertJson(require __DIR__ . '/responses/auth/auth-register-invalid-response.php');
    }

    /**
     * test user register successful
     */
    public function testUserRegisterSuccess()
    {
        $requestBody = [
            'name' => 'James Hackins',
            'email' => 'hackins@tasks.test',
            'password' => '123secret',
            'password_confirmation' => '123secret'
        ];

        $route = route('auth.register');

        $response = $this
            ->json('POST', $route, $requestBody);

        $response->assertStatus(200)
            ->assertJsonStructure(require __DIR__ . '/responses/auth/auth-login-success-response.php');
    }

    /**
     * test email taken error response
     */
    public function testEmailTaken()
    {
        $requestBody = [
            'name' => 'System Admin',
            'email' => 'admin@tasks.test',
            'password' => '123Secret',
            'password_confirmation' => '123Secret'
        ];

        $route = route('auth.register');

        $response = $this
            ->json('POST', $route, $requestBody);

        $response
            ->assertStatus(422)
            ->assertJson(require __DIR__ . '/responses/auth/auth-register-email-taken-response.php');
    }
}
