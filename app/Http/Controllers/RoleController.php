<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public $user;


    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::guard('web')->user();
            return $next($request);
        });
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (is_null($this->user) || !$this->user->can('role.view')) {
            abort(403, 'Sorry !! You are Unauthorized to view any role !');
        }
        // $resArr = [];
        // foreach (Role::all() as $role) {
        //     $res['id'] = $role->id;
        //     $res['name'] = $role->name;
        //     $res['guard_name'] = $role->guard_name;
        //     $res['created_at'] = $role->created_at;
        //     $res['updated_at'] = $role->updated_at;
        //     foreach ($role->getAllPermissions() as $key=>$permission) {
                
        //        $res['permissions'][$key]['id'] = $permission->id;
        //        $res['permissions'][$key]['name'] = $permission->name;
        //        $res['permissions'][$key]['group_name'] = $permission->group_name;
        //        $res['permissions'][$key]['guard_name'] = $permission->guard_name;
        //        $res['permissions'][$key]['pivot_role_id'] = $permission->pivot_role_id;
        //        $res['permissions'][$key]['pivot_permission_id'] = $permission->pivot_permission_id;
        //        $res['permissions'][$key]['created_at'] = $permission->created_at;
        //        $res['permissions'][$key]['updated_at'] = $permission->updated_at;
        //     }
        //     array_push($resArr,$res);
        // }
        $data['roles'] = Role::paginate(10);
        $data['can'] = [
            'create_role' => $this->user->can('role.create'),
            'view_role' => $this->user->can('role.view'),
            'edit_role' => $this->user->can('role.edit'),
            'delete_role' => $this->user->can('role.delete'),
            'approve_role' => $this->user->can('role.approve'),
        ];
        return Inertia::render('Role/Index', $data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (is_null($this->user) || !$this->user->can('role.create')) {
            abort(403, 'Sorry !! You are Unauthorized to create any role !');
        }

        $data['all_permissions']  = Permission::all();
        $permissionGroups = User::getpermissionGroups();
        $permission_groups = [];
        foreach ($permissionGroups as $k => $group) {
            $res = [];
            $res['id'] = $k + 1;
            $res['name'] = ucwords($group->name);
            $res['isChecked'] = false;
            $permissions = User::getpermissionsByGroupName($group->name);
            foreach ($permissions as $key => $permission) {
                $res['permissions'][$key]['id'] = $permission->id;
                $res['permissions'][$key]['name'] = $permission->name;
                $res['permissions'][$key]['isChecked'] = false;
            }
            array_push($permission_groups, $res);
        }
        $data['permission_groups'] = $permission_groups;
        return Inertia::render('Role/Create', $data);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (is_null($this->user) || !$this->user->can('role.create')) {
            abort(403, 'Sorry !! You are Unauthorized to create any role !');
        }

        // Validation Data
        $request->validate([
            'name' => 'required|max:100|unique:roles'
        ], [
            'name.requried' => 'Please give a role name'
        ]);

        // Process Data
        $role = Role::create(['name' => $request->name, 'guard_name' => 'web']);

        $permissions = $request->input('permissions');

        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }

        return redirect()->route('roles.index')->with('success', 'Role created successfully..!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(int $id)
    {

        if (is_null($this->user) || !$this->user->can('role.edit')) {
            abort(403, 'Sorry !! You are Unauthorized to edit any role !');
        }


        $data['all_permissions'] = Permission::all();
        $data['role'] = Role::findById($id, 'web');
        $permissionGroups = User::getpermissionGroups();
        $permission_groups = [];
        foreach ($permissionGroups as $k => $group) {
            $res = [];
            $permissions = User::getpermissionsByGroupName($group->name);
            $checkUserPermission = User::roleHasPermissions($data['role'], $permissions);
            $res['id'] = $k + 1;
            $res['name'] = ucwords($group->name);
            $res['isChecked'] = $checkUserPermission;
            foreach ($permissions as $key => $permission) {
                $res['permissions'][$key]['id'] = $permission->id;
                $res['permissions'][$key]['name'] = $permission->name;
                $res['permissions'][$key]['isChecked'] = $data['role']->hasPermissionTo($permission->name);
            }
            array_push($permission_groups, $res);
        }
        $data['permission_groups'] = $permission_groups;
        return Inertia::render('Role/Edit', $data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id)
    {
        if (is_null($this->user) || !$this->user->can('role.edit')) {
            abort(403, 'Sorry !! You are Unauthorized to edit any role !');
        }
        // This is only for Super Admin role,
        // so that no-one could delete or disable it by somehow.
        if ($id === 1) {
            session()->flash('error', 'Sorry !! You are not authorized to edit this role !');
            return back();
        }

        // Validation Data
        $request->validate([
            'name' => 'required|max:100|unique:roles,name,' . $id
        ], [
            'name.requried' => 'Please give a role name'
        ]);

        $role = Role::findById($id, 'web');
        $permissions = $request->input('permissions');

        if (!empty($permissions)) {
            $role->name = $request->name;
            $role->save();
            $role->syncPermissions($permissions);
        }
        return redirect()->route('roles.index')->with('success', 'Role updated successfully..!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        if (is_null($this->user) || !$this->user->can('role.delete')) {
            abort(403, 'Sorry !! You are Unauthorized to delete any role !');
        }

        // This is only for Super Admin role,
        // so that no-one could delete or disable it by somehow.
        if ($id === 1) {
            session()->flash('error', 'Sorry !! You are not authorized to delete this role !');
            return back();
        }

        $role = Role::findById($id, 'web');
        if (!is_null($role)) {
            $role->delete();
        }

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully..!');
    }
}
