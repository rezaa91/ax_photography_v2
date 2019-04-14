<?php

namespace App\Http\Bundles\SettingsBundle;

use App\Settings as SettingsModel;

class Settings
{
    /**
     * Get the value of the setting passed in as argument
     * @param string $settingName - name of setting
     */
    public function getSettingValue(string $settingName)
    {
        $setting = SettingsModel::where('name', $settingName)->first();

        return $setting->value;
    }

    public function getAllSettings()
    {
        $settings = SettingsModel::all();

        $getSettings = [];

        foreach($settings as $setting) {
            $getSettings[$setting->name] = $setting->value;
        }

        return $getSettings;
    }

    /**
     * Update settings in database with new values
     * @param array $settings
     * 
     * @return void
     */
    public function updateSettings(array $settings)
    {
        foreach($settings as $key => $setting) {
            $update = SettingsModel::first()->where('name', $key)->first();
            $update->name = $key;
            $update->value = $setting;
            $update->save();
        }
    }
}
