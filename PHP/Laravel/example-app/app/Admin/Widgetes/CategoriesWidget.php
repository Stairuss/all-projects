<?php

namespace APP\Admin\Widgetes;

use TCG\Voyager\Widgets\BaseDimmer;
use App\Models\Category;

class CategoriesWidget extends BaseDimmer
{
    protected $config = [];

    public function run()
    {
        $count = Category::count();

        return view('voyager::dimmer', array_merge($this->config, [
            'icon'   => 'voyager-file-text',
            'title'  => "Quantity of Category",
            'text'   => 'You have ' . $count . ' categories in your database',
            'button' => [
                'text' => __('voyager::dimmer.page_link_text'),
                'link' =>'admin/categories',
            ],
            'image' => voyager_asset('images/widget-backgrounds/2023-07-09-night-in-the-mountains-1-59658.jpg'),
        ]));
    }
}
