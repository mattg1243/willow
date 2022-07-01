//! `willow-violet` contains a suite of CI/CD scripts, benches, and tests
//! for the Willow project.

#![warn(missing_docs)]

/// Contains a suite of CI/CD scripts.
pub mod harness;

/// Contains core functions for `willow-gen`, i.e. statement generation
pub mod gen;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }

    #[test]
    fn gen_test() {
        gen::example_html_pdf()
    }
}
