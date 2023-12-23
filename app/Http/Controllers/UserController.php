<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(10);
        return Inertia::render('User/Index', array('users' => $users));
    }
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create()
    {
        return Inertia::render('User/Create');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        Validator::make($request->all(), [
            'name' => ['required'],
            'email' => [
                'required', 'string', 'lowercase', 'email',
                'max:255', 'unique:users'
            ],
        ])->validate();

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('12345678'),
        ]);
        return redirect()->route('users.index')->with('success', 'User created successfully..!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy($id)
    {
        User::find($id)->delete();
        return Redirect::to('/users');
    }
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit($id)
    {
        $user = User::find($id);
        return Inertia::render('User/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function update($id, Request $request)
    {
        Validator::make($request->all(), [
            'name' => ['required'],
            'email' => [
                'required', 'string', 'lowercase', 'email',
                'max:255', 'unique:users,email,' . $id
            ],
        ])->validate();

        User::find($id)->update($request->all());
        return redirect()->route('users.index')->with('success', 'User updated successfully..!');
    }
}
