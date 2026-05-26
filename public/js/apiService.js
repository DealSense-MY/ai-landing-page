/**
 * apiService.js — Handles the single POST /generate API call.
 * This is the ONLY module that makes a fetch() request to the server.
 * All other interactions are local state + render operations.
 */

import { state } from './stateManager.js'
import { previewRenderer } from './previewRenderer.js'

export const apiService = {
  async generate(payload) {
    state.update({ isLoading: true, error: null })

    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': window._appApiKey || '',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let errorMsg = `Server error: ${res.status}`
        try {
          const errData = await res.json()
          if (errData.error) errorMsg = errData.error
        } catch (_) {}
        throw new Error(errorMsg)
      }

      const data = await res.json()

      if (!data.html || !data.json || !data.id) {
        throw new Error('Invalid response from server: missing html, json, or id.')
      }

      const edited = {
        headline: data.json.headline || '',
        subheadline: data.json.subheadline || '',
        ctaText: data.json.ctaText || '',
        features: data.json.features || [],
        benefits: data.json.benefits || [],
        imageUrl: data.json.imageUrl || '',
        phoneNumber: data.json.phoneNumber || '',
        address: data.json.address || '',
        outputLang: data.json.outputLang || 'en',
      }

      state.update({
        normalizedData: data.json,
        generatedHTML: data.html,
        demoId: data.id,
        editedValues: edited,
        isLoading: false,
        error: null,
      })

      previewRenderer.setHTML(data.html)

      return data
    } catch (err) {
      state.update({ isLoading: false, error: err.message })
      throw err
    }
  },
}
