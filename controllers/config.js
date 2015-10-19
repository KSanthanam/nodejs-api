/*!
 * Mi9 Code Challenge - config.js
 */

'use strict';

module.exports = {
  filter: {
  	fields: [ "slug", "title"],
  	condition: function (show) {
  		return (show.drm && show.episodeCount > 0);
  	}
  }
};