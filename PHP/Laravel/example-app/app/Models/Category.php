<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Product;

class Category extends \TCG\Voyager\Models\User
{
    protected $connection = 'mysql';
    protected $table = 'categories';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = ['name'];

    public function product(): HasOne
    {
        return $this->hasOne(Product::class);
    }
}
