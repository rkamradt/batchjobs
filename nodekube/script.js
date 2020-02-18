const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config

const deploymentManifest = require('./buildimage.json')

async function applyDeploy () {
  const client = new Client({ config: config.fromKubeconfig(), version: '1.9' })

  try {
    const create = await client.apis.batch.v1.namespaces('default').jobs.post({ body: deploymentManifest })
    console.log('Create:', create)
  } catch (err) {
    if (err.code !== 409) throw err
    const replace = await client.apis.batch.v1.namespaces('default').jobs('build-image').put({ body: deploymentManifest })
    console.log('Replace:', replace)
  }
}

applyDeploy()
