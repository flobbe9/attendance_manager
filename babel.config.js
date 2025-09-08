module.exports = function(api) {
    api.cache(true);
  
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			["inline-import", { extensions: [".sql"] }],
            [
                'module-resolver',
                {
                    alias: {
                      '@/': './'
                    },
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
                }
            ]
		]
	};
};
  