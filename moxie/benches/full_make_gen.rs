#![feature(test)]
#![allow(soft_unstable)]

extern crate test;
extern crate violetj2p;

use std::time::Instant;
use test::Bencher;
use violetj2p::{
    full_make_html,
    gen::make_gen,
    model::{event::Event, footer::WillowFooter, header::WillowHeader, Footer, Header, RowCol},
};

#[bench]
fn bench_full_make_gen(b: &mut Bencher) {
    pretty_env_logger::try_init().ok();
    let start = Instant::now();

    let new_header = WillowHeader::new(
        "Anne Proxy".to_string(),
        "925-357-6734".to_string(),
        "venmo: 287429847".to_string(),
        "Brandon Belt".to_string(),
    );
    let events: Vec<Event> = Event::mock_deps();
    let footer = WillowFooter::new(600.65);

    log::info!("Running full_make_html with the following params: ");
    log::info!("header: {:?}", new_header);
    log::info!("events: {:?}", events);
    log::info!("footer: {:?}", footer);
    let html_str = full_make_html(new_header, events, footer);
    let try_make_gen: Result<(), std::io::Error> =
        make_gen(html_str, "etc/bench_full_make_gen.pdf");

    let runtime = start.elapsed();
    assert!(try_make_gen.is_ok());
    log::debug!("Finished make_gen invocation in: {:?}", runtime)
}
