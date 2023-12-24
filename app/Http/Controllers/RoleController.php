<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perpage = $request->input('perpage') ?? 10;
        $roles = Role::query()
        ->when($search, function ($query, $search) {
            $query->where('name', 'like', '%' . $search . '%');
        })
        ->latest()->paginate($perpage);
        return Inertia::render('Role/Index', array('roles' => $roles));
    }
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create()
    {
        return Inertia::render('Role/Create');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        Validator::make($request->all(), [
            'name' => ['required', 'string', 'unique:roles_tables']
        ])->validate();

        Role::create([
            'name' => $request->name
        ]);
        return redirect()->route('roles.index')->with('success', 'Role created successfully..!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy($id)
    {
        Role::find($id)->delete();
        return Redirect::to('/roles')->with('success', 'Role deleted successfully..!');
    }
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function edit($id)
    {
        $user = Role::find($id);
        return Inertia::render('Role/Edit', [
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
            'name' => ['required', 'unique:roles_tables,name,' . $id]
        ])->validate();

        Role::find($id)->update($request->all());
        return redirect()->route('roles.index')->with('success', 'Role updated successfully..!');
    }
}
