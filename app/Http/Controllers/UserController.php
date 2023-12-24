<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perpage = $request->input('perpage') ?? 10;
        $users = User::query()
        ->when($search, function ($query, $search) {
            $query->where('name', 'like', '%' . $search . '%')
                ->OrWhere('email', 'like', '%' . $search . '%');
        })
        ->where('role_id',2)
        ->latest()->paginate($perpage);
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
        return Redirect::to('/users')->with('success', 'User deleted successfully..!');
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
