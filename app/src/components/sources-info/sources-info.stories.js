import React from 'react'
import { storiesOf } from '../../@storybook/react'
import { SourcesInfo } from '.'
import { number, select } from '@storybook/addon-knobs'

const stories = storiesOf('Sources', module)

const available = availability => {
  if (availability === 'all') {
    return true
  }
  if (availability === 'none') {
    return false
  }
  return Math.random() > 0.5
}

const generateSources = (numSources = 0, availability) => {
  const sources = []

  for (let i = 0; i < numSources; i++) {
    sources.push({
      actions: [],
      isAvailable: available(availability),
      sourceId: `ddf.distribution.${i}`,
      cataloguedTypes: [],
      version: '',
    })
  }

  return sources
}

stories.add('Basic', () => {
  const n = number('Number of Sources', 4)
  const availability = select(
    'Source Availability',
    {
      all: 'all',
      none: 'none',
      random: 'random',
    },
    'all'
  )
  return <SourcesInfo sources={generateSources(n, availability)} />
})
