/**
 * stateManager.js — Central state store with pub/sub subscriptions.
 * All modules import `state` and call state.update() or state.subscribe().
 */

export const state = {
  normalizedData: {},
  generatedHTML: '',
  demoId: null,

  editedValues: {
    headline: '',
    subheadline: '',
    ctaText: '',
    features: [],
    benefits: [],
    imageUrl: '',
    phoneNumber: '',
    address: '',
    outputLang: 'en',
    tagline: '',
    email: '',
    operatingHours: '',
    ownerName: '',
    yearsInOperation: '',
    googleRating: '',
    totalReviews: '',
    services: [],
    customerReviews: [],
    logoUrl: '',
    galleryImages: [],
    beforeAfterImages: [],
    whatsappMessage: '',
  },

  activeMobileTab: 'form',
  activeView: 'desktop', // 'desktop' | 'mobile'
  isLoading: false,
  error: null,

  _subs: [],

  update(fields) {
    Object.assign(this, fields)
    this._notify()
  },

  subscribe(fn) {
    this._subs.push(fn)
    return () => {
      this._subs = this._subs.filter(s => s !== fn)
    }
  },

  reset() {
    this.update({
      normalizedData: {},
      generatedHTML: '',
      demoId: null,
      editedValues: {
        headline: '',
        subheadline: '',
        ctaText: '',
        features: [],
        benefits: [],
        imageUrl: '',
        phoneNumber: '',
        address: '',
        outputLang: 'en',
        tagline: '',
        email: '',
        operatingHours: '',
        ownerName: '',
        yearsInOperation: '',
        googleRating: '',
        totalReviews: '',
        services: [],
        customerReviews: [],
        logoUrl: '',
        galleryImages: [],
        beforeAfterImages: [],
        whatsappMessage: '',
      },
      activeMobileTab: 'form',
      isLoading: false,
      error: null,
    })
  },

  _notify() {
    this._subs.forEach(fn => {
      try { fn(this) } catch (e) { console.error('State subscriber error:', e) }
    })
  },
}
