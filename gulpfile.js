import gulp from "gulp";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import imageminOptipng from "imagemin-optipng";

const sassWithCompiler = gulpSass(sass);

const paths = {
  sass: {
    src: "assets/css/style.scss",
    dest: "dist/css",
  },
  css: {
    vendors: {
      list: [
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css",
      ],
      dest: "dist/css",
      filename: "vendors.min.css",
    },
  },
  js: {
    vendors: {
      list: [
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/@fortawesome/fontawesome-free/js/all.min.js",
      ],
      dest: "dist/js",
      filename: "vendors.min.js",
    },
    main: {
      src: "assets/js/script.js",
      dest: "dist/js",
      filename: "script.min.js",
    },
  },
  img: {
    src: "assets/img/**/*",
    dest: "dist/img",
  },
};

const sassTask = () => {
  console.log("Starting Sass Task...");
  return gulp
    .src(paths.sass.src)
    .pipe(sassWithCompiler({ outputStyle: "compressed" }))
    .on("error", (err) => {
      console.error("Sass Error:", err.message);
    })
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(paths.sass.dest))
    .on("end", () => {
      console.log("Sass Task Completed.");
    });
};

const cssVendorTask = () => {
  return gulp
    .src(paths.css.vendors.list)
    .pipe(concat(paths.css.vendors.filename))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css.vendors.dest));
};

const vendorScriptsTask = () => {
  return gulp
    .src(paths.js.vendors.list)
    .pipe(concat(paths.js.vendors.filename))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.vendors.dest));
};

const mainScriptTask = () => {
  return gulp
    .src(paths.js.main.src)
    .pipe(concat(paths.js.main.filename))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.main.dest));
};

const imageOptimization = () => {
  return gulp
    .src(paths.img.src)
    .pipe(imagemin([imageminOptipng({ optimizationLevel: 3 })]))
    .pipe(gulp.dest(paths.img.dest));
};

const watchStyles = () => {
  gulp.watch("assets/css/**/*.scss", sassTask);
};

const watchScripts = () => {
  gulp.watch("assets/js/**/*.js", gulp.series(cssVendorTask, vendorScriptsTask, mainScriptTask));
};

const watchImages = () => {
  gulp.watch(paths.img.src, imageOptimization);
};

const watchTasks = gulp.parallel(watchStyles, watchScripts, watchImages);

export default gulp.series(sassTask, cssVendorTask, vendorScriptsTask, mainScriptTask, imageOptimization, watchTasks);
