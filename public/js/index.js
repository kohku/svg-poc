import angular from 'angular'
import { FilteredCanvasController } from './components/filteredCanvas'

angular
  .module('CanvasApp', [])
  .component('filteredCanvas', {
    templateUrl: './js/components/templates/filteredCanvas.html',
    controller: FilteredCanvasController
  });