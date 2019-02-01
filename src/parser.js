const $Show = require('./object/show')
const $Fixture = require('./object/fixture')
const $FixtureGroup = require('./object/group')
const $Preset = require('./object/preset')
const $Cuelist = require('./object/cuelist')
const DB = require('./database')
const Option = require('./config/option')

module.exports = {
  Patch: $Xml => {
    // Set XML Getter
    let $General = $Xml.getElementsByTagName('Fixtures')[0]
    let $Fixtures = $General.getElementsByTagName('Fixture')
    DB.Add({
      Object: 'Show',
      Item: new $Show($General)
    })
    for (let i = 0; i < $Fixtures.length; i++) {
      if ($Fixtures.hasOwnProperty(i)) {
        DB.Add({
          Object: 'Fixture',
          Item: JSON.parse(JSON.stringify(new $Fixture($Fixtures[i])))
        })
      }
    }
  },
  FixtureGroup: async $Xml => {
    // Set XML Getter
    let $General = $Xml.getElementsByTagName('FixtureGroups')[0]
    let $Group = $General.getElementsByTagName('FixtureGroup')
    for (let i = 0; i < $Group.length; i++) {
      if ($Group.hasOwnProperty(i)) {
        let NewFixtureGroup = await new $FixtureGroup.Init(i, $Group[i])
        if (Option.Group.HideAutoGroup) {
          // Remove auto group based on mask attribut
          if (!NewFixtureGroup.Mask) {
            DB.Add({
              Object: 'FixtureGroup',
              Item: JSON.parse(JSON.stringify(NewFixtureGroup))
            })
          }
        } else {
          DB.Add({
            Object: 'FixtureGroup',
            Item: JSON.parse(JSON.stringify(NewFixtureGroup))
          })
        }
      }
    }
  },
  Preset: async $Xml => {
    // Set XML Getter
    let $General = $Xml.getElementsByTagName('Presets')[0]
    let $Presets = $General.getElementsByTagName('Preset')
    for (let i = 0; i < $Presets.length; i++) {
      if ($Presets.hasOwnProperty(i)) {
        DB.Add({
          Object: 'Preset',
          Item: JSON.parse(JSON.stringify(new $Preset($Presets[i])))
        })
      }
    }
  },
  Cuelist: async $Xml => {
    // Set XML Getter
    let $General = $Xml.getElementsByTagName('CueLists')[0]
    let $Cuelists = $General.children
    for (let i = 0; i < $Cuelists.length; i++) {
      if ($Cuelists.hasOwnProperty(i)) {
        DB.Add({
          Object: 'Cuelist',
          Item: JSON.parse(JSON.stringify(new $Cuelist($Cuelists[i])))
        })
      }
    }
  }
}
