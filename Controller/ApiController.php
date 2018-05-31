<?php

namespace Umbrella\ApiDocBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class ApiController extends Controller
{
    /**
     * @param \Symfony\Component\HttpFoundation\Request $Request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
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
     * @param \Symfony\Component\HttpFoundation\Request $Request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function getViewAction(Request $Request) {

        if($this->has('nelmio_api_doc.controller.swagger')) {
            /** @var \Symfony\Component\HttpFoundation\JsonResponse $Response */
            $Response = $this->get('nelmio_api_doc.controller.swagger')($Request);
            $extractedDoc = json_decode($Response->getContent(), true);

            $title = isset($extractedDoc['info']['title']) ? $extractedDoc['info']['title'] : 'Api Documentation';
        } else {
            $title = 'Api Documentation';
        }

        $path = $this->generateUrl('UmbrellaApiDocBundle_api_adm_api_json');
        return $this->render('UmbrellaApiDocBundle::index.html.twig', ['title' => $title, 'path' => $path]);
    }
}
