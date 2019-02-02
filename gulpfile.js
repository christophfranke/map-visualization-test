const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const md = require('markdown-it')({ html: true })
const mila = require('markdown-it-link-attributes')
const webpack = require('webpack')
const path = require('path')
const yargs = require('yargs')
const csv = require('csv-parse')
const fs = require('fs')

md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})

const config = {
	mode: yargs.argv.production ? 'production' : 'development',
  entry: ['babel-polyfill', './main.js'],
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, 'src/js/'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:[ 'es2015', 'stage-2' ]
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
}

gulp.task('csv', () => {
  return new Promise(resolve => {
    const results = []
    // gulp.src('src/data/**/*')
    fs.createReadStream('src/data/set1.csv')
      .pipe(csv())
      .on('data', data => {
        results.push(data)
      })
      .on('end', () => {
        fs.writeFile('src/data/set1.json', JSON.stringify(results), 'utf8', () => {
          resolve()
        })
      })
  })
})

gulp.task('js', ['csv'], () => {
  return new Promise(resolve => webpack(config, (err, stats) => {
    if (err) {
			console.log('Webpack', err)    	
    } 

    console.log(stats.toString({ /* stats options */ }))
    resolve()
  }))
})

function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}


gulp.task('static', () => {
	return gulp.src('src/static/**/*')
		.pipe(gulp.dest('dist'))
})
 
gulp.task('pug', () => {
	return gulp.src('src/pages/**/*.pug')
		.pipe(pug({
			filters: {
				markdown: (input) => {
					return md.render(input)
				}
			}
		})).on('error', swallowError)
		.pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('sass', () => {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sass()).on('error', swallowError)
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
})

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    open: false
  })
})

gulp.task('build', ['pug', 'js', 'sass', 'static'])

gulp.task('watch', ['serve'], () => {
  gulp.watch('src/pages/**/*.pug', ['pug'])
  gulp.watch('src/js/**/*.js', ['js'])
	gulp.watch('src/data/**/*.csv', ['js'])
	gulp.watch('src/content/**/*.md', ['pug'])
	gulp.watch('src/sass/**/*.scss', ['sass'])
	gulp.watch('src/static/**/*', ['static'])
})

gulp.task('default', ['build', 'watch'])
