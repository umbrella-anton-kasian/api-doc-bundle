<?php

namespace Umbrella\ApiDocBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiController extends Controller
{
    /**
     * @param \Symfony\Component\HttpFoundation\Request $Request
     * @return \App\Jelly\System\JellyResponseItem|\Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getJsonAction(Request $Request) {
        if($this->has('nelmio_api_doc.extractor.api_doc_extractor') and class_exists('Nelmio\ApiDocBundle\Annotation\ApiDoc')) {
            $extractedDoc = $this->get('nelmio_api_doc.extractor.api_doc_extractor')->all(\Nelmio\ApiDocBundle\Annotation\ApiDoc::DEFAULT_VIEW);
        } else {
            /** @var \Symfony\Component\HttpFoundation\JsonResponse $Response */
            $Response = $this->get('nelmio_api_doc.controller.swagger')($Request);
            $extractedDoc = json_decode($Response->getContent(), true);
        }

        return new JsonResponse(['response' => $extractedDoc]);
    }

    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getViewAction() {
        return $this->render('UmbrellaApiDocBundle::index.html.twig');
    }
}
