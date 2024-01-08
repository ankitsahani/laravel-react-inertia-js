<?php

namespace App\Http\Controllers;

ini_set('max_execution_time', 0);
ini_set('memory_limit', '-1');

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Reader\Exception;
use PhpOffice\PhpSpreadsheet\Writer\Xls;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class UserController extends Controller
{
    public $user;


    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            $this->user = Auth::guard('web')->user();
            return $next($request);
        });
    }
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perpage = $request->input('perpage') ?? 10;
        $data['users'] = User::query()->with('roles')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->OrWhere('email', 'like', '%' . $search . '%');
            })
            ->where('role_id', "!=", 1)
            ->latest()->paginate($perpage);
        $data['exportusers'] = $this->exportData($search, $perpage);
        $data['can'] = [
            'create_user' => $this->user->can('user.create'),
            'view_user' => $this->user->can('user.view'),
            'edit_user' => $this->user->can('user.edit'),
            'delete_user' => $this->user->can('user.delete'),
            'approve_user' => $this->user->can('user.approve'),
        ];
        return Inertia::render('User/Index', $data);
    }
    /**
     * Write code on Method
     *
     * @return response()
     */
    public function create()
    {
        $data['roles'] = Role::select('roles.name as value', 'roles.name as label')->get();
        return Inertia::render('User/Create', $data);
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
            'pic' => ['required', 'image', 'mimes:jpeg,jpg,png,gif,svg', 'max:2048'],
            'roles.*' => ['required']
        ])->validate();
        if ($request->hasfile('pic')) {
            $file = $request->file('pic');
            $filename = ((string) (microtime(true) * 10000)) . '.' . $file->getClientOriginalExtension();
            // getting attachement extension
            $file->storeAs('public/users/', $filename);
            $pics = $filename;
        }
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'pic' => $pics,
            'password' => Hash::make('12345678'),
        ]);
        if ($request->roles) {
            $user->assignRole($request->roles);
        }
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
        $data['user'] = User::with('roles')->find($id);
        $data['rolesArr'] = Role::select('roles.name as value', 'roles.name as label')->get();
        return Inertia::render('User/Edit', $data);
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
            'pic' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,svg', 'max:2048'],
            'roles.*' => ['required']
        ])->validate();
        $user = User::find($id);
        if ($request->hasfile('pic')) {
            $file = $request->file('pic');
            $filename = ((string) (microtime(true) * 10000)) . '.' . $file->getClientOriginalExtension();
            // getting attachement extension
            $file->storeAs('public/users/', $filename);
            $pics = $filename;
        } else {
            $pics = $user->pic;
        }
        $arr = [
            'name' => $request->name,
            'email' => $request->email,
            'pic' => $pics,
        ];
        $user->update($arr);

        $user->roles()->detach();
        if ($request->roles) {
            $user->assignRole($request->roles);
        }
        return redirect()->route('users.index')->with('success', 'User updated successfully..!');
    }

    /**
     * @param $customer_data
     */
    public function ExportExcel($customer_data)
    {

        try {
            $spreadSheet = new Spreadsheet();
            $spreadSheet->getActiveSheet()->getDefaultColumnDimension()->setWidth(20);
            $spreadSheet->getActiveSheet()->fromArray($customer_data);
            $excel_writer = new Xls($spreadSheet);
            header('Content-Type: application/vnd.ms-excel');
            header('Content-Disposition: attachment;filename="Customer_ExportedData.xls"');
            header('Cache-Control: max-age=0');
            ob_end_clean();
            $excel_writer->save('php://output');
            exit();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    /**
     *This function loads the customer data from the database then converts it
     * into an Array that will be exported to Excel
     */
    public function exportData($search, $perpage)
    {
        $data = User::query()->with('roles')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->OrWhere('email', 'like', '%' . $search . '%');
            })
            ->where('role_id', "!=", 1)->take(599)->get();
        $data_array = [];
        if(count($data)){
            foreach ($data as $key => $data_item) {
                $data_array[] = array(
                    'id' => $key + 1,
                    'name' => $data_item->name,
                    'email' => $data_item->email,
                    'role' => $data_item?->role?->name,
                    'created_at' => $data_item->created_at
                );
            }
        }
        
        return $data_array;
    }
    public function search(Request $request)
    {
        $users = User::search($request->query('q'))->get();

        return response()->json([
            'query' => $request->query('q'),
            'data' => $users,
        ]);
    }
}
