<?php

//generalControllers
$router->route('', 'CheckingAuth.php', '/generalControllers//');

// users
$router->route('users/get', 'GetUser.php', '/users//');
$router->route('users/update', 'UpdateUser.php', '/users//');
$router->route('users/login', 'LoginUser.php', '/users//');
$router->route('users/logout', 'LogoutUser.php', '/users//');
$router->route('users/reset_password', 'ResetPassUser.php', '/users//');
$router->route('users/create', 'CreateUser.php', '/users//');

//admin
$router->route('admin/list', 'GetUsers.php', '/admin//');
$router->route('admin/switch_role', 'SwitchRole.php', '/admin//');
$router->route('admin/delete_user', 'DeleteUser.php', '/admin//');

//files
$router->route('files/list', 'GetFiles.php', '/files//');
$router->route('files/create_folder', 'CreateFolder.php', '/files//');
$router->route('files/add_file', 'AddFile.php', '/files//');
$router->route('files/delete_file', 'DeleteFile.php', '/files//');
$router->route('files/info_file', 'GetFileInfo.php', '/files//');
$router->route('files/rename_file', 'RenameFile.php', '/files//');
$router->route('files/access_control', 'AccessControl.php', '/files//');
$router->route('files/get_provide_files', 'GetProvideFiles.php', '/files//');


$router->mutch();
