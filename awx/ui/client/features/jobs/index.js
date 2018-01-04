import atLibModels from '~models';
import atLibComponents from '~components';

import JobsStrings from '~features/jobs/jobs.strings';
import IndexController from '~features/jobs/index.controller';

const indexTemplate = require('~features/jobs/index.view.html');

const MODULE_NAME = 'at.features.jobs';

function JobsRun ($stateExtender, strings) {
    $stateExtender.addState({
        name: 'jobz',
        route: '/jobz/:id',
        ncyBreadcrumb: {
            label: strings.get('state.TITLE')
        },
        data: {
            activityStream: true,
            activityStreamTarget: 'jobs'
        },
        views: {
            '@': {
                templateUrl: indexTemplate,
                controller: IndexController,
                controllerAs: 'vm'
            }
        },
        resolve: {
            job: ['JobModel', '$stateParams', (Jobs, $stateParams) => {
                const { id } = $stateParams;

                return new Jobs('get', id)
                    .then(job => job.extend('job_events', {
                        params: {
                            page_size: 10,
                            order_by: 'start_line'
                        }
                    }));
            }]
        }
    });
}

JobsRun.$inject = ['$stateExtender', 'JobsStrings'];

angular
    .module(MODULE_NAME, [
        atLibModels,
        atLibComponents
    ])
    .controller('indexController', IndexController)
    .service('JobsStrings', JobsStrings)
    .run(JobsRun);

export default MODULE_NAME;
