/* eslint-disable import/no-extraneous-dependencies */
import { transform } from '@babel/core'
import plugin from '.'

const testPlugin = code => {
  const result = transform(code, {
    plugins: [plugin],
    configFile: false,
  })

  return result.code
}

describe('plugin', () => {
  describe('simple import', () => {
    it('should work with template literal', () => {
      const result = testPlugin(`
          import loadable from '@loadable/component'
          loadable(() => import(\`./ModA\`))
        `)

      expect(result).toMatchSnapshot()
    })

    describe('with "webpackChunkName" comment', () => {
      it('should use it', () => {
        const result = testPlugin(`
          import loadable from '@loadable/component'
          loadable(() => import(/* webpackChunkName: "ChunkA" */ './ModA'))
        `)

        expect(result).toMatchSnapshot()
      })
    })

    describe('without "webpackChunkName" comment', () => {
      it('should add it', () => {
        const result = testPlugin(`
          import loadable from '@loadable/component'
          loadable(() => import('./ModA'))
        `)

        expect(result).toMatchSnapshot()
      })
    })

    describe('in a complex promise', () => {
      it('should work', () => {
        const result = testPlugin(`
          import loadable from '@loadable/component'
          loadable(() => timeout(import('./ModA'), 2000))
        `)

        expect(result).toMatchSnapshot()
      })
    })
  })

  describe('aggressive import', () => {
    it('should work with destructuration', () => {
      const result = testPlugin(`
        import loadable from '@loadable/component'
        loadable(({ foo }) => import(/* webpackChunkName: "Pages" */ \`./\${foo}\`))
      `)
      expect(result).toMatchSnapshot()
    })

    describe('with "webpackChunkName"', () => {
      it('should replace it', () => {
        const result = testPlugin(`
          import loadable from '@loadable/component'
          loadable(props => import(/* webpackChunkName: "Pages" */ \`./\${props.foo}\`))
        `)

        expect(result).toMatchSnapshot()
      })
    })

    describe('without "webpackChunkName"', () => {
      it('should add it', () => {
        const result = testPlugin(`
          import loadable from '@loadable/component'
          loadable(props => import(\`./\${props.foo}\`))
        `)

        expect(result).toMatchSnapshot()
      })
    })
  })

  describe('loadable.lib', () => {
    it('should be transpiled too', () => {
      const result = testPlugin(`
        import loadable from '@loadable/component'
        loadable.lib(() => import('moment'))
      `)

      expect(result).toMatchSnapshot()
    })
  })

  describe('load', () => {
    it('should support naming', () => {
      const result = testPlugin(`
        import Loadable from '@loadable/component'
        Loadable(() => import('moment'))
      `)

      expect(result).toMatchSnapshot()
    })
  })

  describe('load.lib', () => {
    it('should support naming too', () => {
      const result = testPlugin(`
        import Loadable from '@loadable/component'
        Loadable.lib(() => import('moment'))
      `)

      expect(result).toMatchSnapshot()
    })
  })
})
