import { useEffect } from 'react'
import { event } from '../../../events'

// utils
import { getDocTitle } from '@/admin/utils/utils'

// components
import Header from '@/admin/components/header'
import PageTransitionAnimation from '@/admin/atoms/pageTransitionAnimation'
import LoaderScreen from '@/admin/atoms/loadScreen'

// hooks
import { useDisplayToast } from '@/admin/hooks/toast'
import { useHistory } from 'react-router-dom'
import useRole from '@/admin/hooks/useRole'

// store
import useStore from '@/admin/store/store'

const withPageHoc = ({ 
  controller = () => {}, 
  form = {
    hook: () => {}
  }, 
  header = {}, 
  buttons = {}, 
  events = {},
  allowed_roles = ['admin'],
}) => (Component) => {

  header = {
    back: false,
    title: '',
    ...header
  },
  events = {
    hook: () => {},
    update: null,
    load: null,
    collection_created: null,
    ...events
  }
  
  const PageHoc = () => {

    const { 
      loading,
      setLoading  
    } = useStore(state => state)
    
    const displayToast = useDisplayToast()
    const history = useHistory()
    
    const { isAllowed } = useRole(allowed_roles)

    // setup hook
    const {
      ...rest
    } = controller()
    
    const getHeaderTitle = () => {
      if (header.title === '::doc') {
        return getDocTitle(rest.content)
      }
      if (header.title === '::collection') {
        return rest.selectedCollectionName || rest.type
      }
      return header.title
    }
    
    // setup form
    const {
      ...restForm
    } = form.hook({...rest})

    // setup form
    const {
      ...restEvents
    } = events.hook({...rest, ...restForm})

    useEffect(() => {
      !isAllowed(allowed_roles) && history.push('/admin') 
      events.load !== null && setLoading(true)
    }, [])

    // after users are loaded
    useEffect(() => {
      event.subscribe('onUsersLoaded', () => {
        console.log('after users are loaded')
        events.load === 'users' && setLoading(false)
        // restEvents.load && restEvents.load()
      })
      return () => event.unsubscribe('onUsersLoaded')
    }, [])

    // after images are loaded
    useEffect(() => {
      event.subscribe('onImagesLoaded', () => {
        events.load === 'images' && setLoading(false)
        // restEvents.load && restEvents.load()
      })
      return () => event.unsubscribe('onImagesLoaded')
    }, [])

    // after collections list is loaded
    useEffect(() => {
      event.subscribe('onCollectionsListLoaded', () => {
        events.load === 'collections' && setLoading(false)
        // restEvents.load && restEvents.load()
      })
      return () => event.unsubscribe('onCollectionsListLoaded')
    }, [])

    // after collection is loaded
    useEffect(() => {
      event.subscribe('onCollectionLoaded', () => {
        events.load === 'collection' && setLoading(false)
        // restEvents.load && restEvents.load()
      })
      return () => event.unsubscribe('onCollectionLoaded')
    }, [])

    // after collection is created
    useEffect(() => {
      event.subscribe('onCollectionCreated', () => {
        displayToast({
          title: events.collection_created.msg,
          description: events.collection_created.description
        })
        // event ->
        history.goBack()
      })
      return () => event.unsubscribe('onCollectionCreated')
    }, [])

    // after schema loaded
    useEffect(() => {
      event.subscribe('onSchemaLoaded', () => {
        events.load === 'schema' && setLoading(false)
        // restEvents.load && restEvents.load()
      })
      return () => event.unsubscribe('onSchemaLoaded')
    }, [])

    // after Document loaded
    useEffect(() => {
      event.subscribe('onDocLoaded', () => {
        events.load === 'doc' && setLoading(false)
        restEvents.load && restEvents.load()
      })
      return () => event.unsubscribe('onDocLoaded')
    }, [])

    // after doc is created
    useEffect(() => {
      event.subscribe('onDocCreated', (event) => {
        displayToast({
          title: events.created.msg,
          description: events.created.description
        })
        restEvents.create && restEvents.create()
      })
      return () => event.unsubscribe('onDocCreated')
    }, [])

    // after doc is updated
    useEffect(() => {
      event.subscribe('onDocUpdated', (event) => {
        displayToast({
          title: events.update.msg,
          description: events.update.description
        })
        restEvents.update && restEvents.update()
      })
      return () => event.unsubscribe('onDocUpdated')
    }, [])

    // after docs are deleted
    useEffect(() => {
      event.subscribe('onDocsDeleted', (event) => {
        rest.setRerender && rest.setRerender(s => !s)
        displayToast({
          title: events.delete.msg,
          description: events.delete.description
        })
        restEvents.delete && restEvents.delete()
      })
      return () => event.unsubscribe('onDocsDeleted')
    }, [])
    
    // UI with loading state and transition animation

    return (
      <>
        <Header back={header.back} title={getHeaderTitle()}>
          {
            Object.keys(buttons).map((key, i) => {
              const Button = buttons[key]
              return <Button key={i} {...rest} {...restForm} />
            })
          }
        </Header>

        {loading ? (
          <LoaderScreen />
          ) : (
          <PageTransitionAnimation>
            <Component {...rest} {...restForm}/>
          </PageTransitionAnimation>
          )
        }
      </>
    )
  }
  return PageHoc
}

export default withPageHoc