UmbrellaApiDocBundle
====================

Another view template for the [**NelmioApiDocBundle**](https://github.com/nelmio/NelmioApiDocBundle) that allows you to generate 
a decent documentation for your APIs.

## Installation

Open a command console, enter your project directory and execute the following command to download the latest version of this bundle:

```
composer require umbrella-anton-kasian/api-doc-bundle
```

Add the bundle to your kernel::

        class AppKernel extends Kernel
        {
            public function registerBundles()
            {
                $bundles = [
                    // ...

                    new Umbrella\ApiDocBundle\UmbrellaApiDocBundle(),
                ];

                // ...
            }
        }
        
Add routing:

        UmbrellaApiDocBundle:
            resource: "@UmbrellaApiDocBundle/Resources/config/routing.yml"
            prefix:   /api/doc