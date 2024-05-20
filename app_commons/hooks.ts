import test from './fixtures/page.fixture'
import projectData from '../testdata/resources/projectData.json';

test.beforeAll(async ({}) => {
    console.log('Before all the tests...')    
});


test.afterAll(async () => {
    console.log('After all the tests...');
});

export default test