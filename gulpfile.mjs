import gulp from "gulp";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";

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
};

export const sassTask = () => {
  return gulp
    .src(paths.sass.src)
    .pipe(
      sassWithCompiler({
        errLogToConsole: true,
        outputStyle: "compressed",
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(paths.sass.dest));
};

export const cssVendorTask = () => {
  return gulp
    .src(paths.css.vendors.list)
    .pipe(concat(paths.css.vendors.filename))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.css.vendors.dest));
};

export const vendorScriptsTask = () => {
  return gulp
    .src(paths.js.vendors.list)
    .pipe(concat(paths.js.vendors.filename))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.vendors.dest));
};

export const mainScriptTask = () => {
  return gulp
    .src(paths.js.main.src)
    .pipe(concat(paths.js.main.filename))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.main.dest));
};
export const watchStyles = () => {
  gulp.watch("assets/css/**/*.scss", sassTask);
};

export const watchScripts = () => {
  gulp.watch(
    "assets/js/**/*.js",
    gulp.series(cssVendorTask, vendorScriptsTask, mainScriptTask)
  );
};

export const watch = gulp.parallel(watchStyles, watchScripts);

export default gulp.series(
  sassTask,
  cssVendorTask,
  vendorScriptsTask,
  mainScriptTask,
  watch
);

// import imagemin from "gulp-imagemin";
// img: {
//   src: "assets/img/**/*",
//   dest: "dist/img",
// },
// export const watchImages = () => {
//   gulp.watch("assets/img/**/*/", imageOptimization);
// };
// export const imageOptimization = () => {
//   return gulp
//     .src(paths.img.src)
//     .pipe(imagemin())
//     .pipe(gulp.dest(paths.img.dest));
// };
// watchImages,
