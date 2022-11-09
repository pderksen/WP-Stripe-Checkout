<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitb15b4328f642a8c511800bdf6172862c
{
    public static $prefixLengthsPsr4 = array (
        'S' => 
        array (
            'SimplePay\\Vendor\\Stripe\\' => 24,
            'SimplePay\\Vendor\\' => 17,
            'SimplePay\\Core\\' => 15,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'SimplePay\\Vendor\\Stripe\\' => 
        array (
            0 => __DIR__ . '/../..' . '/lib/Stripe/lib',
        ),
        'SimplePay\\Vendor\\' => 
        array (
            0 => __DIR__ . '/../..' . '/lib',
        ),
        'SimplePay\\Core\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitb15b4328f642a8c511800bdf6172862c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitb15b4328f642a8c511800bdf6172862c::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitb15b4328f642a8c511800bdf6172862c::$classMap;

        }, null, ClassLoader::class);
    }
}
