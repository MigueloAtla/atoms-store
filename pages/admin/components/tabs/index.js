import React from 'react'

// components
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const TabsPage = ({ tabs }) => {
  
  return (
    <Tabs>
      <TabList style={{
        position: 'sticky',
        top: '0px',
        backgroundColor: 'rgba(24, 26, 27, 0.93)'
      }}>
        {
          tabs.map((tab, i) => {
            return <Tab key={tab.title} _selected={{ color: 'white', bg: '#0e0d17', boxShadow: 'none' }}>{tab.title}</Tab>
          })
        }
      </TabList>

      <TabPanels>
          {
            tabs.map((tab, i) => {
              const Component = tab.component
              return (
                <TabPanel key={tab.title + i}>
                  <Component />
                </TabPanel>
              ) 
            })
          }
      </TabPanels>
    </Tabs>
  )
}

export default TabsPage