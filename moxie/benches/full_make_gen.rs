#![feature(test)]
#![allow(soft_unstable)]

extern crate moxie;
extern crate test;

use moxie::{
    gen::full_make_html,
    gen::make_gen,
    model::{header::WillowHeader, event::Event, footer::WillowFooter},
};
use std::time::Instant;
use test::Bencher;

#[bench]
fn bench_full_make_gen(b: &mut Bencher) {
    pretty_env_logger::try_init().ok();
    let start = Instant::now();

    let new_header = WillowHeader::new(
        "Anne Proxy".to_string(),
        "925-357-6734".to_string(),
        serde_json::json!({"eth": "anneproxy.eth"}),
        "Brandon Belt".to_string(),
    );
    let events: Vec<Event> = Event::mock_deps();
    let footer = WillowFooter::new(600.65);

    log::info!("Running full_make_html with the following params: ");
    log::info!("header: {:?}", new_header);
    log::info!("events: {:?}", events);
    log::info!("footer: {:?}", footer);
    let html_str = full_make_html(new_header, events);
    let try_make_gen: Result<(), std::io::Error> =
        make_gen(html_str, "etc/bench_full_make_gen.pdf");

    let runtime = start.elapsed();
    assert!(try_make_gen.is_ok());
    log::debug!("Finished make_gen invocation in: {:?}", runtime)
}
