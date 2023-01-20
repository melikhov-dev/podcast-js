const fs = require('node:fs');
const yaml = require('js-yaml');
const music = require('music-metadata');
const htmlmin = require('html-minifier');
const xml = require('minify-xml');

module.exports = (config) => {
	config.addDataExtension('yml', (contents) => {
		return yaml.load(contents);
	});

	config.addFilter('length', (path) => {
		const stats = fs.statSync(path);

		return stats.size;
	});

	const getDuration = async (path) => {
		const metadata = await music.parseFile(path, { duration: true });
		const duration = parseFloat(metadata.format.duration);
		const formatted = new Date(Math.ceil(duration) * 1000)
			.toISOString()
			.substring(11, 19);

		return formatted;
	}

	config.addJavaScriptFunction('duration', (path) => {
		return getDuration(path);
	});

	config.addFilter('htmlmin', (value) => {
		return htmlmin.minify(
			value, {
				removeComments: true,
				collapseWhitespace: true,
			}
		);
	});

	// config.addTransform('xmlmin', (content, outputPath) => {
	// 	if (outputPath && outputPath.endsWith('.xml')) {
	// 		return xml.minify(content);
	// 	}

	// 	return content;
	// });

	return {
		dir: {
			input: 'src',
			output: 'dist',
			data: 'data'
		}
	};
};
