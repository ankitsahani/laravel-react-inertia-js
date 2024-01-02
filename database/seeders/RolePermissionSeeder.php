<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * Enable these options if you need same role and other permission for User Model
         * Else, please follow the below steps for admin guard
         */

        // Create Roles and Permissions
        // $roleSuperAdmin = Role::create(['name' => 'superadmin']);
        // $roleAdmin = Role::create(['name' => 'admin']);
        // $roleEditor = Role::create(['name' => 'editor']);
        // $roleUser = Role::create(['name' => 'user']);


        // Permission List as array
        $permissions = [

            [
                'group_name' => 'dashboard',
                'permissions' => [
                    'dashboard.view',
                    'dashboard.edit',
                ]
            ],
            [
                'group_name' => 'user',
                'permissions' => [
                    // Blog Permissions
                    'user.create',
                    'user.view',
                    'user.edit',
                    'user.delete',
                    'user.approve',
                ]
            ],
            [
                'group_name' => 'admin',
                'permissions' => [
                    // admin Permissions
                    'admin.create',
                    'admin.view',
                    'admin.edit',
                    'admin.delete',
                    'admin.approve',
                ]
            ],
            [
                'group_name' => 'role',
                'permissions' => [
                    // role Permissions
                    'role.create',
                    'role.view',
                    'role.edit',
                    'role.delete',
                    'role.approve',
                ]
            ],
            [
                'group_name' => 'profile',
                'permissions' => [
                    // profile Permissions
                    'profile.view',
                    'profile.edit',
                    'profile.delete',
                ]
            ],
        ];


        // Do same for the admin guard for tutorial purposes
        $checkrole = Role::where('name', 'superadmin')->first();
        if (!$checkrole) {
            $roleSuperAdmin = Role::create(['name' => 'superadmin', 'guard_name' => 'web']);
            // Create and Assign Permissions
            for ($i = 0; $i < count($permissions); $i++) {
                $permissionGroup = $permissions[$i]['group_name'];
                for ($j = 0; $j < count($permissions[$i]['permissions']); $j++) {
                    // Create Permission
                    $permission = Permission::create([
                        'name' => $permissions[$i]['permissions'][$j],
                        'group_name' => $permissionGroup, 'guard_name' => 'web'
                    ]);
                    $roleSuperAdmin->givePermissionTo($permission);
                    $permission->assignRole($roleSuperAdmin);
                }
            }

            // Assign super admin role permission to superadmin user
            $admin = User::where('email', 'admin@gmail.com')->first();
            if ($admin) {
                $admin->assignRole($roleSuperAdmin);
            }
        }
    }
}
