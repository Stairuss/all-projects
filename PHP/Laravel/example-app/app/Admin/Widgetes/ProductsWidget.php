<?php

namespace App\Admin\Widgetes;

use TCG\Voyager\Widgets\BaseDimmer;
use App\Models\Product;

class ProductsWidget extends BaseDimmer
{
    protected $config = [];

    public function run()
    {
        $count = Product::count();
        return view('voyager::dimmer', array_merge($this->config, [
            'icon' => 'voyager-watch',
            'title' => 'Quantity of Products',
            'text' => 'You have ' . $count . ' products in your database',
            'button' => [
                'text' => __('voyager::dimmer.page_link_text'),
                'link' => '/admin/products',
            ],
            'image' => voyager_asset('images/widget-backgrounds/Art (3440x1440).jpg'),
        ]));
    }
}
